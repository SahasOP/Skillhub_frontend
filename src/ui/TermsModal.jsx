// custom/ui/TermsModal.jsx
import React from "react";
import { X } from "lucide-react"; // Import the X icon
import Button from "./Button";

const TermsModal = ({ isOpen, onClose,handleAgreeToTerms }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-lg relative"> {/* Updated max-w-4xl */}
        {/* Close "X" Icon in the Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={24} /> {/* Use the X icon with size 24 */}
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Terms and Conditions
        </h3>

        {/* <div className="overflow-y-auto max-h-96 mb-4 text-gray-700"> 
          <p><strong>Study Title:</strong> Understanding Virtual Lab Usage and User Experience for Education Technology Research</p>
          <br />
          <p><strong>1. Purpose of the Study:</strong> The goal of this study is to evaluate how students engage with the Virtual Lab platform, assess learning outcomes, and gather feedback for improving the platform. Your participation will help us improve the Virtual Lab experience for future users.</p>
          <p><strong>2. What You Will Be Asked to Do:</strong> If you choose to participate, you will:
            <ul className="list-disc pl-6">
              <li>Complete assigned tasks within the Virtual Lab.</li>
              <li>Allow the collection of anonymized data, such as task completion time, usage frequency, and navigation patterns.</li>
              <li>Optionally respond to surveys about your experience (e.g., satisfaction, perceived learning, usability).</li>
            </ul>
          </p>
          <p><strong>3. Data Collection:</strong> Data collected includes:
            <ul className="list-disc pl-6">
              <li>Usage statistics (e.g., time spent on tasks, navigation paths).</li>
              <li>Performance data (e.g., task accuracy, completion rates).</li>
              <li>Survey responses (optional).</li>
            </ul>
            All data will be anonymized to protect your privacy and will only be used for research purposes. Your personal identity will not be linked to the collected data.
          </p>
          <p><strong>4. Voluntary Participation:</strong> Your participation in this study is voluntary. You are free to:
            <ul className="list-disc pl-6">
              <li>Skip participation or withdraw at any time without penalty.</li>
              <li>If you withdraw, any data collected before your withdrawal may still be used, as it will be anonymized.</li>
            </ul>
          </p>
          <p><strong>5. Risks and Benefits:</strong>
            <ul className="list-disc pl-6">
              <li><strong>Risks:</strong> There are minimal risks related to data collection, and all precautions will be taken to ensure privacy.</li>
              <li><strong>Benefits:</strong> Your feedback will help improve the Virtual Lab experience and contribute to advancing educational technology.</li>
            </ul>
          </p>
          <p><strong>6. Confidentiality:</strong> All data collected will remain confidential. No identifying information will be shared, and the data will be securely stored and encrypted.</p>
          <p><strong>7. Consent:</strong> By participating, you consent to the collection of anonymized usage data and feedback for research purposes.</p>
          <br />
          <p><strong>Principal Investigator:</strong> Dr. Namrata Manglani</p>
          <p><strong>Institution/Department:</strong> Shah And Anchor Kutchhi Engineering College</p>
          <p><strong>Contact Information:</strong> namrata.manglani@sakec.ac.in</p>
        </div> */}

        {/* Consent Button */}
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-lg">Agree</Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
