use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;
use crate::state::{League, LeaderboardEntry, MatchResult, Prediction};

#[cw_serde]
pub struct InstantiateMsg {}

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
}
