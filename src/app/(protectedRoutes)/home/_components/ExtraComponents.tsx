import Link from 'next/link';

const AIAgentsContent = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-[200px]">
      <Link href="/ai-agents" className="cursor-pointer">
        <div className="relative">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-[#2c8c88] rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r text-white bg-clip-text">
                  AI
                </span>
              </div>
            </div>

            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: '20s' }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full shadow-md"></div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 flex flex-col gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>

          <div className="absolute -bottom-4 -left-4 flex flex-col gap-1">
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
              style={{ animationDelay: '2.5s' }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const SettingsContent = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-[200px]">
      <Link href="/settings" className="cursor-pointer">
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 p-4 bg-card border-border rounded-lg shadow-lg border">
            <div className="bg-gradient-to-br from-gray-700 to-blue-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-white">Webinars</span>
              </div>
              <div className="text-lg font-bold text-white">24</div>
            </div>

            <div className="bg-gradient-to-br border border-border from-gray-700 to-green-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-white">Products</span>
              </div>
              <div className="text-lg font-bold text-white">12</div>
            </div>

            <div className="bg-gradient-to-br border border-border from-gray-700 to-purple-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-medium text-white">Revenue</span>
              </div>
              <div className="text-lg font-bold text-white">$5.2K</div>
            </div>

            <div className="bg-gradient-to-br border border-border from-gray-700 to-orange-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white">Stripe</span>
              </div>
              <div className="text-sm font-bold text-white">Active</div>
            </div>
          </div>

          <div className="absolute -top-2 -right-2">
            <div
              className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center animate-spin"
              style={{ animationDuration: '3s' }}
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="absolute -bottom-1 -left-1">
            <div
              className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center animate-spin"
              style={{ animationDuration: '4s', animationDirection: 'reverse' }}
            >
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export { AIAgentsContent, SettingsContent };
