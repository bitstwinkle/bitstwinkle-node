"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const CODING = -999;
const SYSTEM = -444;
const APPLICATION = -777;
class UniError {
    constructor(type, code, message) {
        this.type = type;
        this.code = code;
        this.message = message;
    }
    IsApplication() {
        return this.type === APPLICATION;
    }
    IsCoding() {
        return this.type === CODING;
    }
    IsSystem() {
        return this.type === SYSTEM;
    }
}
