/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 注意：由于使用了 output: 'export'，headers配置不会生效
  // CORS需要在后端服务器中配置
}

export default nextConfig