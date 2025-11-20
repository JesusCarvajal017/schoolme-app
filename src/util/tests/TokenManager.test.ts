import { tokenValido, manejarToken } from '../TokenManager';

jest.mock('jwt-decode');

const mockJwtDecode = require('jwt-decode');

describe('TokenManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('tokenValido', () => {
    it('debe retornar true para token válido', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hora en futuro
      mockJwtDecode.mockReturnValue({ exp: futureExp });

      const result = tokenValido('validToken');
      expect(result).toBe(true);
      expect(mockJwtDecode).toHaveBeenCalledWith('validToken');
    });

    it('debe retornar false para token expirado', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hora en pasado
      mockJwtDecode.mockReturnValue({ exp: pastExp });

      const result = tokenValido('expiredToken');
      expect(result).toBe(false);
    });

    it('debe retornar false para token sin exp', () => {
      mockJwtDecode.mockReturnValue({});

      const result = tokenValido('noExpToken');
      expect(result).toBe(false);
    });

    it('debe retornar false para token inválido', () => {
      mockJwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = tokenValido('invalidToken');
      expect(result).toBe(false);
    });
  });

  describe('manejarToken', () => {
    it('debe programar logout cuando token expira', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      mockJwtDecode.mockReturnValue({ exp: pastExp });
      const mockLogout = jest.fn();

      manejarToken('expiredToken', mockLogout);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockJwtDecode).toHaveBeenCalledWith('expiredToken');
    });

    it('debe programar setTimeout para logout futuro', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      mockJwtDecode.mockReturnValue({ exp: futureExp });
      const mockLogout = jest.fn();

      manejarToken('validToken', mockLogout);

      expect(mockLogout).not.toHaveBeenCalled();
      jest.advanceTimersByTime(3600000); // 1 hora
      expect(mockLogout).toHaveBeenCalled();
    });

    it('debe llamar logout si no hay exp', () => {
      mockJwtDecode.mockReturnValue({});
      const mockLogout = jest.fn();

      manejarToken('noExpToken', mockLogout);

      expect(mockLogout).toHaveBeenCalled();
    });

    it('debe llamar logout si decode falla', () => {
      mockJwtDecode.mockImplementation(() => {
        throw new Error('Decode error');
      });
      const mockLogout = jest.fn();

      manejarToken('invalidToken', mockLogout);

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});