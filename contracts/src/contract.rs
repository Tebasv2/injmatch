#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, BankMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo,
    Order, Response, StdResult, Uint128,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{
    Config, League, LeaderboardEntry, LeagueStatus, MatchResult, MatchStage, Prediction,
    CONFIG, LEAGUES, MATCH_RESULTS, PREDICTIONS,
};

const CONTRACT_NAME: &str = "crates.io:injmatch";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(
        deps.storage,
        &Config {
            owner: info.sender.to_string(),
            league_count: 0,
        },
    )?;
    Ok(Response::new().add_attribute("action", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateLeague { name, entry_fee, max_participants } => {
            execute_create_league(deps, env, info, name, entry_fee, max_participants)
        }
        ExecuteMsg::JoinLeague { league_id } => execute_join_league(deps, env, info, league_id),
        ExecuteMsg::SubmitPrediction { league_id, match_id, home_score, away_score } => {
            execute_submit_prediction(deps, env, info, league_id, match_id, home_score, away_score)
        }
        ExecuteMsg::SubmitResult { league_id, match_id, home_team, away_team, home_score, away_score } => {
            execute_submit_result(deps, env, info, league_id, match_id, home_team, away_team, home_score, away_score)
        }
        ExecuteMsg::DistributePrizes { league_id } => {
            execute_distribute_prizes(deps, env, info, league_id)
        }
        ExecuteMsg::StartLeague { league_id } => execute_start_league(deps, info, league_id),
        ExecuteMsg::FinishLeague { league_id } => execute_finish_league(deps, info, league_id),
    }
}

fn execute_create_league(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    name: String,
    entry_fee: Uint128,
    max_participants: u32,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    config.league_count += 1;
    let league_id = config.league_count.to_string();

    let league = League {
        id: league_id.clone(),
        name: name.clone(),
        admin: info.sender.to_string(),
        entry_fee,
        prize_pool: Uint128::zero(),
        max_participants,
        participants: vec![],
        status: LeagueStatus::Open,
        prizes_distributed: false,
        created_at: env.block.time.seconds(),
    };

    LEAGUES.save(deps.storage, &league_id, &league)?;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "create_league")
        .add_attribute("league_id", league_id)
        .add_attribute("name", name))
}

fn execute_join_league(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    league_id: String,
) -> Result<Response, ContractError> {
    let mut league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if !matches!(league.status, LeagueStatus::Open) {
        return Err(ContractError::LeagueNotOpen {});
    }
    if league.participants.len() as u32 >= league.max_participants {
        return Err(ContractError::LeagueFull {});
    }
    if league.participants.contains(&info.sender.to_string()) {
        return Err(ContractError::AlreadyJoined {});
    }

    let sent = info
        .funds
        .iter()
        .find(|c| c.denom == "inj")
        .map(|c| c.amount)
        .unwrap_or(Uint128::zero());

    if sent < league.entry_fee {
        return Err(ContractError::InsufficientFee {
            required: league.entry_fee.to_string(),
            sent: sent.to_string(),
        });
    }

    league.participants.push(info.sender.to_string());
    league.prize_pool += sent;
    LEAGUES.save(deps.storage, &league_id, &league)?;

    Ok(Response::new()
        .add_attribute("action", "join_league")
        .add_attribute("league_id", league_id)
        .add_attribute("participant", info.sender))
}

fn execute_submit_prediction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    league_id: String,
    match_id: String,
    home_score: u32,
    away_score: u32,
) -> Result<Response, ContractError> {
    let league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if !league.participants.contains(&info.sender.to_string()) {
        return Err(ContractError::Unauthorized {});
    }

    let pred_key = (league_id.as_str(), info.sender.as_str(), match_id.as_str());
    if PREDICTIONS.may_load(deps.storage, pred_key)?.is_some() {
        return Err(ContractError::PredictionAlreadySubmitted {});
    }

    let prediction = Prediction {
        predictor: info.sender.to_string(),
        league_id: league_id.clone(),
        match_id: match_id.clone(),
        home_score,
        away_score,
        submitted_at: env.block.time.seconds(),
    };

    PREDICTIONS.save(deps.storage, pred_key, &prediction)?;

    Ok(Response::new()
        .add_attribute("action", "submit_prediction")
        .add_attribute("league_id", league_id)
        .add_attribute("match_id", match_id))
}

fn execute_submit_result(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    league_id: String,
    match_id: String,
    home_team: String,
    away_team: String,
    home_score: u32,
    away_score: u32,
) -> Result<Response, ContractError> {
    let league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if league.admin != info.sender.to_string() {
        return Err(ContractError::Unauthorized {});
    }

    let result_key = (league_id.as_str(), match_id.as_str());
    if MATCH_RESULTS.may_load(deps.storage, result_key)?.is_some() {
        return Err(ContractError::ResultAlreadySubmitted {});
    }

    let result = MatchResult {
        match_id: match_id.clone(),
        home_team,
        away_team,
        home_score,
        away_score,
        stage: MatchStage::Group,
    };

    MATCH_RESULTS.save(deps.storage, result_key, &result)?;

    Ok(Response::new()
        .add_attribute("action", "submit_result")
        .add_attribute("league_id", league_id)
        .add_attribute("match_id", match_id))
}

fn execute_distribute_prizes(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    league_id: String,
) -> Result<Response, ContractError> {
    let mut league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if league.admin != info.sender.to_string() {
        return Err(ContractError::Unauthorized {});
    }
    if !matches!(league.status, LeagueStatus::Finished) {
        return Err(ContractError::LeagueNotFinished {});
    }
    if league.prizes_distributed {
        return Err(ContractError::PrizesAlreadyDistributed {});
    }

    let leaderboard = compute_leaderboard(deps.as_ref(), &league_id, &league)?;

    let mut messages: Vec<CosmosMsg> = vec![];
    let prize_pool = league.prize_pool;

    // Distribution: 60% first, 30% second, 10% third
    let shares = [600u128, 300u128, 100u128];
    for (i, entry) in leaderboard.iter().take(3).enumerate() {
        let amount = prize_pool.u128() * shares[i] / 1000;
        if amount > 0 {
            messages.push(CosmosMsg::Bank(BankMsg::Send {
                to_address: entry.address.clone(),
                amount: vec![Coin {
                    denom: "inj".to_string(),
                    amount: Uint128::from(amount),
                }],
            }));
        }
    }

    league.prizes_distributed = true;
    LEAGUES.save(deps.storage, &league_id, &league)?;

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("action", "distribute_prizes")
        .add_attribute("league_id", league_id)
        .add_attribute("prize_pool", prize_pool))
}

fn execute_start_league(
    deps: DepsMut,
    info: MessageInfo,
    league_id: String,
) -> Result<Response, ContractError> {
    let mut league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if league.admin != info.sender.to_string() {
        return Err(ContractError::Unauthorized {});
    }

    league.status = LeagueStatus::Active;
    LEAGUES.save(deps.storage, &league_id, &league)?;

    Ok(Response::new()
        .add_attribute("action", "start_league")
        .add_attribute("league_id", league_id))
}

fn execute_finish_league(
    deps: DepsMut,
    info: MessageInfo,
    league_id: String,
) -> Result<Response, ContractError> {
    let mut league = LEAGUES.load(deps.storage, &league_id)
        .map_err(|_| ContractError::LeagueNotFound {})?;

    if league.admin != info.sender.to_string() {
        return Err(ContractError::Unauthorized {});
    }

    league.status = LeagueStatus::Finished;
    LEAGUES.save(deps.storage, &league_id, &league)?;

    Ok(Response::new()
        .add_attribute("action", "finish_league")
        .add_attribute("league_id", league_id))
}

fn compute_leaderboard(
    deps: Deps,
    league_id: &str,
    league: &League,
) -> StdResult<Vec<LeaderboardEntry>> {
    let mut scores: std::collections::HashMap<String, (u64, u32, u32)> =
        std::collections::HashMap::new();

    for participant in &league.participants {
        scores.insert(participant.clone(), (0, 0, 0));
    }

    let results: Vec<((String, String), MatchResult)> = MATCH_RESULTS
        .prefix(league_id)
        .range(deps.storage, None, None, Order::Ascending)
        .filter_map(|r| r.ok())
        .collect();

    for ((_, match_id), result) in &results {
        for participant in &league.participants {
            let pred_key = (league_id, participant.as_str(), match_id.as_str());
            if let Ok(Some(pred)) = PREDICTIONS.may_load(deps.storage, pred_key) {
                let entry = scores.entry(participant.clone()).or_insert((0, 0, 0));

                let exact = pred.home_score == result.home_score
                    && pred.away_score == result.away_score;
                let correct_outcome = outcome(pred.home_score, pred.away_score)
                    == outcome(result.home_score, result.away_score);

                if exact {
                    entry.0 += 3;
                    entry.1 += 1;
                } else if correct_outcome {
                    entry.0 += 1;
                    entry.2 += 1;
                }
            }
        }
    }

    let mut entries: Vec<LeaderboardEntry> = scores
        .into_iter()
        .map(|(address, (points, correct_scores, correct_outcomes))| LeaderboardEntry {
            address,
            points,
            correct_scores,
            correct_outcomes,
            rank: 0,
        })
        .collect();

    entries.sort_by(|a, b| b.points.cmp(&a.points));
    for (i, entry) in entries.iter_mut().enumerate() {
        entry.rank = (i + 1) as u32;
    }

    Ok(entries)
}

fn outcome(home: u32, away: u32) -> i8 {
    if home > away { 1 } else if home < away { -1 } else { 0 }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetLeague { league_id } => {
            let league = LEAGUES.load(deps.storage, &league_id)?;
            to_json_binary(&league)
        }
        QueryMsg::GetLeaderboard { league_id } => {
            let league = LEAGUES.load(deps.storage, &league_id)?;
            let leaderboard = compute_leaderboard(deps, &league_id, &league)?;
            to_json_binary(&leaderboard)
        }
        QueryMsg::GetPredictions { league_id, predictor } => {
            let preds: Vec<Prediction> = if let Some(addr) = predictor {
                PREDICTIONS
                    .sub_prefix((league_id.as_str(), addr.as_str()))
                    .range(deps.storage, None, None, Order::Ascending)
                    .filter_map(|r| r.ok())
                    .map(|(_, p)| p)
                    .collect()
            } else {
                PREDICTIONS
                    .prefix(league_id.as_str())
                    .range(deps.storage, None, None, Order::Ascending)
                    .filter_map(|r| r.ok())
                    .map(|(_, p)| p)
                    .collect()
            };
            to_json_binary(&preds)
        }
        QueryMsg::ListLeagues { start_after, limit } => {
            let limit = limit.unwrap_or(30) as usize;
            let start = start_after
                .as_deref()
                .map(|s| cosmwasm_std::Bound::exclusive(s));
            let leagues: Vec<League> = LEAGUES
                .range(deps.storage, start, None, Order::Ascending)
                .take(limit)
                .filter_map(|r| r.ok())
                .map(|(_, l)| l)
                .collect();
            to_json_binary(&leagues)
        }
        QueryMsg::GetMatchResult { league_id, match_id } => {
            let result =
                MATCH_RESULTS.may_load(deps.storage, (league_id.as_str(), match_id.as_str()))?;
            to_json_binary(&result)
        }
    }
}
