'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { loadWebData } from './webSlice';
import { useEffect } from 'react';

function DataLoader() {
  const dispatch = store.dispatch;

  useEffect(() => {
    dispatch(loadWebData());
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <DataLoader />
      {children}
    </Provider>
  );
}
