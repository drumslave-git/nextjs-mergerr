import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"
import {User} from "@/common/api/TPDB/types"

export class UserAPI extends BaseEntityAPI {
  auth() {
    return this._get<User, any>('auth/user')
  }
}