// In frontend/hooks/useSmsListener.js

// ... (imports)

export default function useSmsListener(isReady) {
  useEffect(() => {
    if (!isReady) {
      // ...
      return;
    }
    // ...
    const subscription = SmsListener.addListener(async (message) => {
      // ...
      if (parsedExpense) {
        // ...
        await Notifications.scheduleNotificationAsync({
          content: {
            // ...
            // Use the new category identifier
            categoryIdentifier: 'expense_actions_modal',
          },
          trigger: null,
        });
      }
    });
    // ...
  }, [isReady]);
}