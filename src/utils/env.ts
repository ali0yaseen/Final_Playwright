export type EnvConfig = {
  baseUrl: string;
  apiUrl: string;
  userEmail: string;
  userPassword: string;
  defaultFirstName: string;
  defaultLastName: string;
};

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) {
    throw new Error(
      `Missing env var ${name}. Create a .env file (see .env.example) and set ${name}.`
    );
  }
  return v;
}

export const env: EnvConfig = {
  baseUrl: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
  userEmail: required('USER_EMAIL', 'customer@practicesoftwaretesting.com'),
  userPassword: required('USER_PASSWORD', 'welcome01'),
  defaultFirstName: process.env.DEFAULT_FIRST_NAME || 'Ali',
  defaultLastName: process.env.DEFAULT_LAST_NAME || 'Yaseen'
};
