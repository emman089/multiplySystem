export const checkMemberTransaction = async (setMemberTransaction) => {
  try {
    const response = await fetch(`http://localhost:3001/api/auth/check-transaction`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch member data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);  // Log to inspect the structure of the response

    if (data && data.user) {
      setMemberTransaction(data);  // Assuming data.user contains the expected data
    } else {
      console.error('Invalid data structure or missing user');
    }
  } catch (error) {
    console.error('Member check error:', error);
  }
};
