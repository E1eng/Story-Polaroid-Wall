/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  reactStrictMode: true,
  images: {
    unoptimized: true,

    domains: ['lh3.googleusercontent.com'], 
  },
}

module.exports = nextConfig