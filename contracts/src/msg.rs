use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;
use crate::state::{FantasyEntry, League, LeaderboardEntry, MatchResult, Prediction, SavedSquad};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub struct PlayerScore {
    pub player_id: String,
    pub points: i64,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateLeague {
        name: String,
        entry_fee: Uint128,
        max_participants: u32,
    },
    JoinLeague {
        league_id: String,
    },
    SubmitPrediction {
        league_id: String,
        match_id: String,
        home_score: u32,
        away_score: u32,
    },
    SubmitResult {
        league_id: String,
        match_id: String,
        home_team: String,
        away_team: String,
        home_score: u32,
        away_score: u32,
    },
    DistributePrizes {
        league_id: String,
    },
    StartLeague {
        league_id: String,
    },
    FinishLeague {
        league_id: String,
    },
    SaveSquad {
        formation: String,
        starter_ids: Vec<String>,
        bench_ids: Vec<String>,
        captain_id: Option<String>,
        vice_captain_id: Option<String>,
    },
    // Admin-only: record player points for a finished fixture and credit each squad
    SubmitPlayerScores {
        fixture_id: String,
        player_scores: Vec<PlayerScore>,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(League)]
    GetLeague { league_id: String },

    #[returns(Vec<LeaderboardEntry>)]
    GetLeaderboard { league_id: String },

    #[returns(Vec<Prediction>)]
    GetPredictions {
        league_id: String,
        predictor: Option<String>,
    },

    #[returns(Vec<League>)]
    ListLeagues {
        start_after: Option<String>,
        limit: Option<u32>,
    },

    #[returns(Option<MatchResult>)]
    GetMatchResult { league_id: String, match_id: String },

    #[returns(Option<SavedSquad>)]
    GetSquad { owner: String },

    // Fantasy leaderboard ranked by total fantasy points
    #[returns(Vec<FantasyEntry>)]
    GetFantasyLeaderboard { limit: Option<u32> },
}
