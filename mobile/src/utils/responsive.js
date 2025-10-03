import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Baseado em um design padrão (iPhone 11 Pro)
const baseWidth = 375;
const baseHeight = 812;

// Escala proporcional baseada na largura da tela
const scale = SCREEN_WIDTH / baseWidth;
const verticalScale = SCREEN_HEIGHT / baseHeight;

/**
 * Normaliza o tamanho da fonte para ser proporcional em todos os dispositivos
 * @param {number} size - Tamanho base da fonte
 * @param {number} factor - Fator de moderação (0-1), quanto menor, menos variação entre dispositivos
 * @returns {number} - Tamanho normalizado
 */
export const normalize = (size, factor = 0.5) => {
  const newSize = size * scale;
  
  // Modera a escala para evitar textos muito grandes ou pequenos
  const moderatedSize = size + (newSize - size) * factor;
  
  // Arredonda para o pixel mais próximo
  return Math.round(PixelRatio.roundToNearestPixel(moderatedSize));
};

/**
 * Escala horizontal (largura)
 */
export const horizontalScale = (size) => {
  return Math.round(size * scale);
};

/**
 * Escala vertical (altura)
 */
export const verticalScaleFunc = (size) => {
  return Math.round(size * verticalScale);
};

/**
 * Escala moderada - melhor para espaçamentos
 */
export const moderateScale = (size, factor = 0.5) => {
  return Math.round(size + (horizontalScale(size) - size) * factor);
};

// Tamanhos de fonte padronizados
export const fontSize = {
  tiny: normalize(10),
  small: normalize(12),
  regular: normalize(14),
  medium: normalize(16),
  large: normalize(18),
  xlarge: normalize(20),
  xxlarge: normalize(24),
  huge: normalize(28),
  massive: normalize(32),
};

// Espaçamentos padronizados
export const spacing = {
  tiny: moderateScale(4),
  small: moderateScale(8),
  regular: moderateScale(12),
  medium: moderateScale(16),
  large: moderateScale(20),
  xlarge: moderateScale(24),
  xxlarge: moderateScale(32),
  huge: moderateScale(40),
};

export default {
  normalize,
  horizontalScale,
  verticalScale: verticalScaleFunc,
  moderateScale,
  fontSize,
  spacing,
};
