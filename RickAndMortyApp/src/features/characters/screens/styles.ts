import { StyleSheet } from 'react-native';

export const HORIZONTAL_PADDING = 20;
export const CARD_VERTICAL_MARGIN = 40;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: CARD_VERTICAL_MARGIN / 2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    pointerEvents: 'box-none',
  },
  arrowButton: {
    padding: 10,
  },
});
