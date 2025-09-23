const { constants }  = require("../constant");
const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode){
        case constants.NOT_FOUND:
            res.status(404).json({ title: "Not found!", message: err.message });
            break;
        case constants.VALIDATION_ERROR:
            res.status(400).json({ title: "Validation failed", message: err.message });
            break;
        case constants.FORBIDDEN:
            res.status(403).json({ title: "Forbidden", message: err.message });
            break;
        case constants.UNAUTHORIZED:
            res.status(401).json({ title: "Unauthorized", message: err.message });
            break;
        default:
            res.status(500).json({ title: "Internal Server Error", message: err.message || "An unexpected error occurred" });
    }
}

module.exports = errorHandler;