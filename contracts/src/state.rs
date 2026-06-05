use cosmwasm_schema::cw_serde;
use cosmwasm_std::Uint128;
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub enum LeagueStatus {
    Open,
    Active,
    Finished,
}

#[cw_serde]
pub struct League {
    pub id: String,
    pub name: String,
    pub admin: String,
    pub entry_fee: Uint128,
    pub prize_pool: Uint128,
    pub max_participants: u32,
    pub participants: Vec<String>,
    pub status: LeagueStatus,
    pub prizes_distributed: bool,
    pub created_at: u64,
}

#[cw_serde]
pub enum MatchStage {
    Group,
    RoundOf16,
    QuarterFinal,
    SemiFinal,
    Final,
}

#[cw_serde]
pub struct MatchResult {
    pub match_id: String,
    pub home_team: String,
    pub away_team: String,
    pub home_score: u32,
    pub away_score: u32,
    pub stage: MatchStage,
}

#[cw_serde]
pub struct Prediction {
    pub predictor: String,
    pub league_id: String,
    pub match_id: String,
    pub home_score: u32,
    pub away_score: u32,
    pub submitted_at: u64,
}

#[cw_serde]
pub struct LeaderboardEntry {
    pub address: String,
    pub points: u64,
    pub correct_scores: u32,
    pub correct_outcomes: u32,
    pub rank: u32,
}

#[cw_serde]
pub struct FantasyEntry {
    pub address: String,
    pub total_points: i64,
    pub rank: u32,
}

#[cw_serde]
pub struct Config {
    pub owner: String,
    pub league_count: u64,
}

#[cw_serde]
pub struct SavedSquad {
    pub owner: String,
    pub formation: String,
    pub starter_ids: Vec<String>,
    pub bench_ids: Vec<String>,
    pub captain_id: Option<String>,
    pub vice_captain_id: Option<String>,
    pub saved_at: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const LEAGUES: Map<&str, League> = Map::new("leagues");
pub const MATCH_RESULTS: Map<(&str, &str), MatchResult> = Map::new("match_results");
pub const PREDICTIONS: Map<(&str, &str, &str), Prediction> = Map::new("predictions");
pub const SQUADS: Map<&str, SavedSquad> = Map::new("squads");
// (fixture_id, player_id) -> points scored in that fixture
pub const PLAYER_SCORES: Map<(&str, &str), i64> = Map::new("player_scores");
// wallet_address -> cumulative fantasy points across all scored fixtures
pub const FANTASY_POINTS: Map<&str, i64> = Map::new("fantasy_points");
