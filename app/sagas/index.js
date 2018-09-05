import latex from '../modules/latex/sagas';

export default function* rootSaga() {
  yield [
    latex(),
  ];
}
