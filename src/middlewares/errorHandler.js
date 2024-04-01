import enumErrors from "../services/enum";

export default (error, req, res, next) => {
    switch (error.code) {
        case enumErrors.INVALID_TYPES_ERROR:
            res.status(500).json({
                message: error.message,
                code: error.code,
                cause: error.cause,
            });
            break;

        case enumErrors.DATABASE_ERROR:
            res.status(500).json({
                message: error.message,
                code: error.code,
                cause: error.cause,
            });
            break;

        case enumErrors.ROUTING_ERROR:
            res.status(404).json({
                message: error.message,
                code: error.code,
                cause: error.cause,
            });
            break;

            case enumErrors.ADDING_PRODUCT_ERROR:
                res.status(500).json({
                    message: error.message,
                    code: error.code,
                    cause: error.cause,
                });
                break;

            case enumErrors.FINDING_PRODUCT_ERROR:
                res.status(500).json({
                    message: error.message,
                    code: error.code,
                    cause: error.cause,
                })
                break; 

        default:
            res.status(500).json({
                message: "Error desconocido",
                code: 0,
                cause: error,
            });
            break;
    }
};
