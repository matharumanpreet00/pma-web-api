import { Action } from "routing-controllers";

import { User } from "../api/models/User";
import { Logger } from "../lib/logger";
import { TokenInfoInterface } from "./TokenInfoInterface";
import { Connection } from "typeorm";

export function currentUserChecker(connection: Connection): (action: Action) => Promise<User | undefined> {
    const log = new Logger(__filename);

    return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
        // here you can use request/response objects from action
        // you need to provide a user object that will be injected in controller actions
        // demo code:
        const tokeninfo: TokenInfoInterface = action.request.tokeninfo;

        const db = connection.mongoManager;

        const user = await db.findOne<User>(User, {
            where: {
                id: tokeninfo.user_id
            }
        });

        if (user) {
            log.info("Current user is ", user.toString());
        } else {
            log.info("Current user is undefined");
        }

        return user;
    };
}
