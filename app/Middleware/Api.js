'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]('Adonis/Core/Env'))
const standalone_1 = require('@adonisjs/auth/build/standalone')

class default_1 {
  constructor() {
    this.redirectTo = '/auth/login'
  }

  async authenticate({ auth, request }) {
    // 🔴 AUTENTIKASI DINONAKTIFKAN SEMENTARA
    auth.defaultGuard = 'api'
    return true
  }

  async handle(ctx, next) {
    await this.authenticate(ctx)
    await next()
  }
}

exports.default = default_1
