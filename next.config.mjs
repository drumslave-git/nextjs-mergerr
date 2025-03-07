/** @type {import('next').NextConfig} */
import analyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = analyzer({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
                pathname: '**',
            },
        ],
    },
    webpack: (config, context) => {
        // Enable polling based on env variable being set
        if(process.env.NEXT_WEBPACK_USEPOLLING) {
            config.watchOptions = {
                poll: 500,
                aggregateTimeout: 300
            }
        }
        return config
    },
    experimental: {
        reactCompiler: true,
    }
}

export default withBundleAnalyzer(nextConfig)
