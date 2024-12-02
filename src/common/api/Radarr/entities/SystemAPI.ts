import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

// Define types for system-related responses
export interface SystemStatus {
  version: string;
  buildTime: string;
  isDebug: boolean;
  isProduction: boolean;
  isAdmin: boolean;
  isUserInteractive: boolean;
  startupPath: string;
  appData: string;
  osName: string;
  osVersion: string;
  isNetCore: boolean;
}

export class SystemAPI extends BaseEntityAPI {
  // Method to get system status
  async getStatus() {
    return await this._get<SystemStatus, any>("system/status")
  }

  // Method to get system logs
  async getLogs() {
    return await this._get<string[], any>("log")
  }

  // Method to trigger application restart
  async restart() {
    await this._post("system/restart")
  }

  // Method to trigger application shutdown
  async shutdown() {
    await this._post("system/shutdown")
  }

  // Method to get Radarr's current backup list
  async getBackups() {
    return await this._get<string[], any>("backup")
  }
}
