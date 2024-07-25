/** @type {import('next').NextConfig} */
import analyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = analyzer({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
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
    modularizeImports: {
        "@mui/material/?(((\\w*)?/?)*)": {
            transform: "@mui/material/{{ matches.[1] }}/{{member}}",
        },
        "@mui/icons-material/?(((\\w*)?/?)*)": {
            transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
        },
    },
};

export default withBundleAnalyzer(nextConfig);
