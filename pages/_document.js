import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Tag meta ini akan "memaksa" layout desktop di semua ukuran layar */}
        <meta name="viewport" content="width=1180" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

