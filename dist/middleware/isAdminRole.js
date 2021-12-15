"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminRole = void 0;
function isAdminRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                return res.status(401).json({ message: "unauthorized" });
            if (req.user.role !== "admin")
                return res.status(403).json({ message: "forbidden" });
            return next();
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "oops! something went wrong, please try again later." });
        }
    });
}
exports.isAdminRole = isAdminRole;
//# sourceMappingURL=isAdminRole.js.map