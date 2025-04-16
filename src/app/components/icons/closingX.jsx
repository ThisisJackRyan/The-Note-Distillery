import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';

const ClosingX = ({ onCloseFunc, icon=faXmark }) => {
    return (
        <div className="md:hidden">
            <button
              onClick={onCloseFunc}
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={icon} className="h-6 w-6 text-2xl" />
            </button>
        </div>
    );
};

export default ClosingX;