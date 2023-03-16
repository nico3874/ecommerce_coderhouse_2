import { codeError } from "../../customErrors/errors/codeErrors.js";


export default (error, req, res, next) => {
    console.log('desde el middleware...'+error.code)
    console.log(error.cause);
    switch(error.code) {
        case codeError.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
            break
        default:
            res.send({status: "error", error: "Unhandled error"})
    }
}