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

type Type = number

const CODING: Type = -999
const SYSTEM: Type = -444
const APPLICATION: Type = -777

export type UError = UniError | null

class UniError {
    constructor(public type: Type, public code: string, public message: string) {
    }

    public IsApplication(): boolean {
        return this.type === APPLICATION
    }

    public IsCoding(): boolean {
        return this.type === CODING
    }

    public IsSystem(): boolean {
        return this.type === SYSTEM
    }
}

