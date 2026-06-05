#!/usr/bin/env python3
"""
Lower bulk memory instructions (memory.copy, memory.fill) to byte loops.
Works by:
1. Disassembling with wasm-dis (Binaryen S-expression format)
2. Adding __memcpy and __memset helper functions
3. Replacing (memory.copy ...) and (memory.fill ...) with function calls
4. Reassembling with wasm-as
"""
import subprocess, sys, re, os, tempfile

INPUT  = sys.argv[1] if len(sys.argv) > 1 else "contracts/artifacts/injmatch.wasm"
OUTPUT = sys.argv[2] if len(sys.argv) > 2 else "contracts/artifacts/injmatch_nomem.wasm"

print(f"[lower-bulk-memory] disassembling {INPUT}...")
result = subprocess.run(["wasm-dis", INPUT], capture_output=True, text=True)
if result.returncode != 0:
    print(result.stderr); sys.exit(1)
wat = result.stdout

# Helper functions to inject (before the last closing paren of the module)
HELPERS = """
 ;; __memcpy: dst src len -> none  (replaces memory.copy)
 (func $__memcpy (param $dst i32) (param $src i32) (param $len i32)
  (local $i i32)
  (local.set $i (i32.const 0))
  (block $break
   (loop $loop
    (br_if $break (i32.ge_u (local.get $i) (local.get $len)))
    (i32.store8
     (i32.add (local.get $dst) (local.get $i))
     (i32.load8_u (i32.add (local.get $src) (local.get $i)))
    )
    (local.set $i (i32.add (local.get $i) (i32.const 1)))
    (br $loop)
   )
  )
 )
 ;; __memset: dst val len -> none  (replaces memory.fill)
 (func $__memset (param $dst i32) (param $val i32) (param $len i32)
  (local $i i32)
  (local.set $i (i32.const 0))
  (block $break
   (loop $loop
    (br_if $break (i32.ge_u (local.get $i) (local.get $len)))
    (i32.store8
     (i32.add (local.get $dst) (local.get $i))
     (local.get $val)
    )
    (local.set $i (i32.add (local.get $i) (i32.const 1)))
    (br $loop)
   )
  )
 )
"""

def extract_sexp(text, start):
    """Extract a complete S-expression starting at `start` (which must be '(')."""
    assert text[start] == '('
    depth = 0
    i = start
    in_str = False
    while i < len(text):
        c = text[i]
        if c == '"' and not in_str:
            in_str = True
        elif c == '"' and in_str:
            in_str = False
        elif not in_str:
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
                if depth == 0:
                    return text[start:i+1], i+1
        i += 1
    raise ValueError(f"Unmatched paren at {start}")

def replace_memory_ops(wat):
    """Replace (memory.copy ...) and (memory.fill ...) with helper calls."""
    out = []
    i = 0
    n = len(wat)
    copy_count = 0
    fill_count = 0

    while i < n:
        # Look for (memory.copy or (memory.fill
        mc = wat.find('(memory.copy', i)
        mf = wat.find('(memory.fill', i)

        # Pick whichever comes first
        candidates = [(p, t) for p, t in [(mc, 'copy'), (mf, 'fill')] if p != -1]
        if not candidates:
            out.append(wat[i:])
            break

        pos, kind = min(candidates, key=lambda x: x[0])
        out.append(wat[i:pos])

        # Extract the full S-expression
        sexp, end = extract_sexp(wat, pos)

        # Parse children (skip 'memory.copy'/'memory.fill' keyword, get 3 args)
        # Format: (memory.copy DEST SRC LEN) or (memory.fill DST VAL LEN)
        inner = sexp[1:-1].strip()  # strip outer parens
        # Remove the keyword
        keyword_end = inner.index(' ')
        rest = inner[keyword_end:].strip()

        # Extract 3 child S-expressions
        args = []
        j = 0
        while j < len(rest) and len(args) < 3:
            rest_here = rest[j:]
            # skip whitespace
            while j < len(rest) and rest[j] in ' \t\n\r':
                j += 1
            if j >= len(rest):
                break
            if rest[j] == '(':
                child, rel_end = extract_sexp(rest, j)
                args.append(child)
                j += rel_end - j
            else:
                # bare token (shouldn't happen in Binaryen S-expr for memory ops)
                end_tok = j
                while end_tok < len(rest) and rest[end_tok] not in ' \t\n\r()':
                    end_tok += 1
                args.append(rest[j:end_tok])
                j = end_tok

        if len(args) != 3:
            print(f"  WARNING: expected 3 args for memory.{kind}, got {len(args)}: {sexp[:80]}")
            out.append(sexp)
            i = end
            continue

        if kind == 'copy':
            replacement = f'(call $__memcpy {args[0]} {args[1]} {args[2]})'
            copy_count += 1
        else:
            replacement = f'(call $__memset {args[0]} {args[1]} {args[2]})'
            fill_count += 1

        out.append(replacement)
        i = end

    print(f"[lower-bulk-memory] replaced {copy_count} memory.copy, {fill_count} memory.fill")
    return ''.join(out)

wat = replace_memory_ops(wat)

# Inject helpers before the last ')' of the module
last_paren = wat.rfind(')')
wat = wat[:last_paren] + HELPERS + wat[last_paren:]

# Write to temp file and assemble
with tempfile.NamedTemporaryFile(suffix='.wat', mode='w', delete=False) as f:
    f.write(wat)
    tmp_wat = f.name

print(f"[lower-bulk-memory] assembling to {OUTPUT}...")
result = subprocess.run(
    ["wasm-as", tmp_wat, "-o", OUTPUT, "--all-features", "--disable-bulk-memory"],
    capture_output=True, text=True
)
os.unlink(tmp_wat)

if result.returncode != 0:
    print("[lower-bulk-memory] wasm-as FAILED:")
    print(result.stderr[:3000])
    sys.exit(1)

print(f"[lower-bulk-memory] done! Output: {OUTPUT}")
# Verify no bulk memory remains
verify = subprocess.run(["wasm-tools", "print", OUTPUT], capture_output=True, text=True)
remaining = verify.stdout.count('memory.copy') + verify.stdout.count('memory.fill')
print(f"[lower-bulk-memory] remaining bulk memory ops: {remaining}")
if remaining == 0:
    print("[lower-bulk-memory] SUCCESS — no bulk memory instructions remain")
else:
    print("[lower-bulk-memory] WARNING — some bulk memory instructions still present")
