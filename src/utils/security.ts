// Security utilities for password hashing and validation
import { createHash } from 'crypto'

// Simple password hashing using SHA-256 (in production, use bcrypt)
export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex')
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword
}

// Input validation and sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateStudentId = (studentId: string): boolean => {
  const idRegex = /^CS\/\d{4}\/\d{3}$/
  return idRegex.test(studentId)
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)
  
  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }
  
  if (now - attempts.lastAttempt > windowMs) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }
  
  if (attempts.count >= maxAttempts) {
    return false
  }
  
  loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: now })
  return true
}

export const resetRateLimit = (identifier: string): void => {
  loginAttempts.delete(identifier)
}