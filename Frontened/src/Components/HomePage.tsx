import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Modal } from "./Modal";

export const HomePage=()=> {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card>
        <div className="flex flex-col items-center space-y-4">
          <Button label="Join a Room" onClick={() => setIsModalOpen(true)} />
          <Button label="Create a Room" />
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Join a Room</h2>
        <input
          type="text"
          placeholder="Enter Room Code"
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <Button label="Join" onClick={() => alert("Joining...")} />
      </Modal>
    </div>
  );
}


