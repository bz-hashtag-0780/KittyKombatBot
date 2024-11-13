export const verifyTelegramUser = async (initData: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-telegram`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ initData }),
		}
	);

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.error || 'Failed to authenticate');
	}
	return data;
};

export const updateUserData = async (
	userId: string,
	newData: object,
	initData: string
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-data`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId, newData, initData }), // Include initData for authentication
		}
	);

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.error || 'Failed to update data');
	}
	return data;
};
