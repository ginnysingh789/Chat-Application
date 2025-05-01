import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { Button } from "./Button";

// You'll need to install framer-motion: npm install framer-motion
import { motion } from "framer-motion";

// Add these icons from Lucide React: npm install lucide-react
import { MessageSquare, Users, Sparkles, ChevronRight ,MessageCircle} from 'lucide-react';

// Add this CSS to your global CSS file or create a new one
const floatKeyframes = `
@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20px, 20px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;

export const HomePage = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Add the keyframes to the document
        const styleElement = document.createElement("style");
        styleElement.innerHTML = floatKeyframes;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const createRoom = () => {
        const randomRoomId = Math.random().toString(36).substring(2, 7);
        navigate(`/room/${randomRoomId}`);
    };

    const joinRoom = () => {
        console.log("Join Room Called");
        navigate("/Join");
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-4" style={{ backgroundSize: "400% 400%", animation: "gradientAnimation 15s ease infinite" }}>
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full mix-blend-screen filter blur-xl opacity-20"
                        style={{
                            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                            width: `${Math.random() * 400 + 100}px`,
                            height: `${Math.random() * 400 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="relative"
                            >
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur opacity-70"></div>
                                <div className="relative bg-black rounded-full p-3">
                                    <MessageCircle className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>
                            
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-center text-white/70 mb-8"
                        >
                            Connect with others in real-time through our secure and immersive chat experience
                        </motion.p>

                        <div className="space-y-4">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="group"
                            >
                                <Button
                                    label="Create a Room"
                                    onClick={createRoom}
                                    variant="secondary"
                                    icon={<Sparkles className="h-5 w-5" />}
                                    className="h-14 w-full"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="group"
                            >
                                <Button
                                    label="Join a Room"
                                    onClick={joinRoom}
                                    variant="secondary"
                                    icon={<Users className="h-5 w-5" />}
                                    className="h-14 w-full"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="bg-gradient-to-r from-violet-900/30 to-indigo-900/30 p-4 text-center text-white/50 text-sm"
                    >
                        End-to-end encrypted • Secure • Private
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};