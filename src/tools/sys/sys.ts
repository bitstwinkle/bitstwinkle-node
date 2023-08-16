/*
 *
 *  *  * Copyright (C) 2023 The Developer bitstwinkle
 *  *  *
 *  *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  *  * you may not use this file except in compliance with the License.
 *  *  * You may obtain a copy of the License at
 *  *  *
 *  *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *  *
 *  *  * Unless required by applicable law or agreed to in writing, software
 *  *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  *  * See the License for the specific language governing permissions and
 *  *  * limitations under the License.
 *
 */

import {randID} from "../unique/unique";

export namespace sys {
    export const SERVER_ID = randID()

    export enum Mode {
        LOCAL = "local",
        DEV = "dev",
        TEST = "test",
        PRE = "pre",
        PROD = "prod",
    }

    export function modeOf(modeStr: string): Mode {
        switch (modeStr) {
            case Mode.LOCAL:
                return Mode.LOCAL
            case Mode.DEV:
                return Mode.DEV
            case Mode.TEST:
                return Mode.TEST
            case Mode.PRE:
                return Mode.PRE
            case Mode.PROD:
                return Mode.PROD
        }
        return Mode.DEV
    }

    export let RUN_MODE: Mode = Mode.LOCAL

    export function SetRunMode(currentMode: string) {
        RUN_MODE = <Mode>currentMode
    }

    export function isRd(): boolean {
        return RUN_MODE===Mode.LOCAL ||
            RUN_MODE===Mode.DEV ||
            RUN_MODE===Mode.TEST ||
            RUN_MODE===Mode.PRE
    }
}

