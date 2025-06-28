import axios from "axios";


export interface Credentials {
    email: string;
    password: string;
}

export interface RegisterPayload extends Credentials {
    name: string;
}

export interface AuthResponse {
    token: string;
}

const TOKEN_KEY = "token";

export const authService = {
    register: async (data: RegisterPayload): Promise<void> => {
        console.log("Registering with data:", data);
        const res = await axios.post("/user/", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.statusText !== "OK") {
            const text = res.statusText;
            throw new Error(`Registrierung fehlgeschlagen: ${text}`);
        }
    },

    login: async (credentials: Credentials): Promise<void> => {
        const res = await axios.post(`/api/user/login`, credentials, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.statusText !== "OK") {
            const text = res.statusText;
            throw new Error(`Registrierung fehlgeschlagen: ${text}`);
        }
        const data: AuthResponse = await res.data();
        sessionStorage.setItem(TOKEN_KEY, data.token);

        //get and save user id
        const token = sessionStorage.getItem(TOKEN_KEY);

        const uidRes = await axios.get(`/user/email?email=` + credentials.email, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        sessionStorage.setItem("userID", uidRes.data.id);
        //console.log("userID: ", sessionStorage.getItem("userID"));
    },

    logout: () => {
        sessionStorage.removeItem(TOKEN_KEY);
    },

    getToken: (): string | null => {
        return sessionStorage.getItem(TOKEN_KEY);
    },

    isLoggedIn: (): boolean => {
        return !!sessionStorage.getItem(TOKEN_KEY);
    },

};
