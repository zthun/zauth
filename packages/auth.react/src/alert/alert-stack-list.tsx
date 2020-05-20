import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useAlertStack } from './alert-stack.context';

export function ZAlertStackList() {
  const stack = useAlertStack();
  const [alerts, setAlerts] = useState(stack.list);

  useEffect(() => {
    const subscription = stack.change.subscribe((updated) => setAlerts(updated));
    return () => subscription.unsubscribe();
  });

  const components = alerts.map((alert) => {
    function handleClose() {
      stack.remove(alert);
    }

    return (
      <Alert className='ZAlertStackList-alert mb-sm' data-testid='ZAlertStackList-alert' variant='outlined' key={alert._id} severity={alert.severity} onClose={handleClose}>
        <AlertTitle>{alert.header}</AlertTitle>
        {alert.message}
      </Alert>
    );
  });

  return <div className='ZAlertStackList-root'>{components}</div>;
}