import { login, sendResetCode, validateVerificationCode, resetPassword } from '../authService';

const mockAxios = require('axios');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar respuesta exitosa en login válido', async () => {
      const mockResponse = {
        token: 'abc123',
        user: { id: 1, email: 'test@example.com' },
        person: { id: 1, name: 'Test User' }
      };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await login('test@example.com', 'password');

      expect(result).toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/Auth'),
        { email: 'test@example.com', password: 'password' },
        { method: 'POST' }
      );
    });

    it('debe lanzar error en login fallido', async () => {
      const errorMessage = 'Invalid credentials';
      mockAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(login('wrong@example.com', 'wrongpass')).rejects.toThrow(errorMessage);
    });
  });

  describe('sendResetCode', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('debe enviar código de reset exitosamente', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({ success: true }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await sendResetCode('test@example.com');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/Auth/ResetPassword/test@example.com'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('debe lanzar error si respuesta no ok', async () => {
      const mockResponse = { ok: false, status: 400, statusText: 'Bad Request', text: jest.fn().mockResolvedValue('Error') };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(sendResetCode('test@example.com')).rejects.toThrow('HTTP 400 - Error');
    });
  });

  describe('validateVerificationCode', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('debe validar código exitosamente', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({ valid: true }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await validateVerificationCode('test@example.com', '123456');

      expect(result).toEqual({ valid: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/Auth/ValidationCode/test@example.com/123456'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('resetPassword', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('debe resetear contraseña exitosamente', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({ success: true }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resetPassword(1, 'newpass', 'newpass');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/User/passwordUpdate'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ idUser: 1, passwordNew: 'newpass', passwordConfirm: 'newpass' })
        })
      );
    });
  });
});