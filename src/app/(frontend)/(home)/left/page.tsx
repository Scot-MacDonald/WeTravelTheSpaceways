import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LeftOverlayShell } from '@/components/LeftOverlayShell'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../../(site)/[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function LeftPage() {
  const { isEnabled: draft } = await draftMode()

  const decodedSlug = 'left'
  const url = '/left'

  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <LeftOverlayShell>
      <article className="pt-16 pb-24">
        <PageClient />

        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </article>
    </LeftOverlayShell>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug: 'left',
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
