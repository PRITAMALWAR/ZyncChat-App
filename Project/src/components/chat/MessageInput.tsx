import { useState, useRef, KeyboardEvent } from 'react';
import { Smile, Paperclip, Send, X, Image, File, Mic } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (files: FileList | null) => void;
  attachments: any[];
  onRemoveAttachment: (id: string) => void;
}

const MessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  onFileUpload,
  attachments,
  onRemoveAttachment
}: MessageInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map(attachment => {
            const IconComponent = 
              attachment.type === 'image' ? Image :
              attachment.type === 'audio' ? Mic : File;
            
            return (
              <div 
                key={attachment.id}
                className="relative group bg-gray-100 dark:bg-gray-700 rounded-md p-2 pr-8 flex items-center gap-2"
              >
                <IconComponent size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
                <button 
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="absolute right-1 top-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      <div className={`flex items-end rounded-lg border ${isFocused ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 overflow-hidden`}>
        <div className="flex-shrink-0 px-2 py-2 flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <Smile size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => onFileUpload(e.target.files)}
          />
          <button
            type="button"
            onClick={handleFileSelect}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <Paperclip size={20} />
          </button>
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 block w-full py-2 px-0 resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
          placeholder="Type a message..."
          rows={1}
          style={{ 
            minHeight: '40px',
            maxHeight: '120px',
            height: 'auto',
          }}
        ></textarea>
        
        <div className="flex-shrink-0 pl-1 pr-2 py-2">
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() && attachments.length === 0}
            className={`p-2 rounded-full ${
              !value.trim() && attachments.length === 0
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;