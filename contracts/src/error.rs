use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("League not found")]
    LeagueNotFound {},

    #[error("League is not open")]
    LeagueNotOpen {},

    #[error("League is full")]
    LeagueFull {},

    #[error("Already joined this league")]
    AlreadyJoined {},

    #[error("Insufficient entry fee: required {required}, sent {sent}")]
    InsufficientFee { required: String, sent: String },

    #[error("Match result already submitted")]
    ResultAlreadySubmitted {},

    #[error("Prediction already submitted for this match")]
    PredictionAlreadySubmitted {},

    #[error("League is not finished")]
    LeagueNotFinished {},

    #[error("Prizes already distributed")]
    PrizesAlreadyDistributed {},
}
