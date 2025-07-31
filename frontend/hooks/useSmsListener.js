// frontend/hooks/useSmsListener.js

import { useEffect } from 'react';
import SmsListener from 'react-native-android-sms-listener';
import * as Notifications from 'expo-notifications';
import { parseExpenseFromSms } from '../utils/smsParser';

// ✅ The hook now accepts the isReady state
export default function useSmsListener(isReady) {
  useEffect(() => {
    // ✅ Guard Clause: If the app isn't ready, do nothing.
    if (!isReady) {
      console.log('🎧 App not ready, SMS listener is waiting.');
      return;
    }

    console.log('🎧 App is ready, initializing SMS Listener...');

    const subscription = SmsListener.addListener(async (message) => {
      const { body } = message;
      console.log('📩 SMS Received by Hook:', body);

      const parsedExpense = parseExpenseFromSms(body);

      if (parsedExpense) {
        console.log('✅ SMS Parsed successfully:', parsedExpense);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Expense Detected!',
            body: `₹${parsedExpense.amount} spent at ${parsedExpense.name}. Enter a category below and tap "Quick Add".`,
            data: {
              amount: parsedExpense.amount,
              name: parsedExpense.name,
              date: parsedExpense.date.toISOString(),
            },
            categoryIdentifier: 'expense_actions',
          },
          trigger: null,
        });
      }
    });

    return () => {
      console.log('🔇 Removing SMS Listener from Hook');
      // It's good practice to check if the subscription exists before removing
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isReady]); // ✅ The hook now depends on the isReady state
}
