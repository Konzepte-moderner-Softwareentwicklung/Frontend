interface ContactOptionsProps {
    isPhone: boolean;
    isEmail: boolean;
    isChat: boolean;
    onPhoneChange: (checked: boolean) => void;
    onEmailChange: (checked: boolean) => void;
    onChatChange: (checked: boolean) => void;
}

export function ContactOptions({
    isPhone,
    isEmail,
    isChat,
    onPhoneChange,
    onEmailChange,
    onChatChange,
}: ContactOptionsProps) {
    return (
        <div className="flex gap-4">
            <label className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={isPhone}
                    onChange={(e) => onPhoneChange(e.target.checked)}
                />
                Handy
            </label>
            <label className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={isEmail}
                    onChange={(e) => onEmailChange(e.target.checked)}
                />
                E-Mail
            </label>
            <label className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={isChat} 
                    onChange={(e) => onChatChange(e.target.checked)}
                />
                Chat
            </label>
        </div>
    );
} 