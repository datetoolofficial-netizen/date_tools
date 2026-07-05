'use client';

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{12,20}$/i;
const ADSENSE_SLOT_PATTERN = /^\d{4,20}$/;

function clean(value = '') {
    return String(value || '').trim();
}

const SLOT_ALIASES = {
    dateTop: ['top'],
    dateMiddle: ['middle'],
    dateBottom: ['bottom1', 'bottom2'],
};

function getSlotNames(slotName) {
    return [slotName, ...(SLOT_ALIASES[slotName] || [])];
}

function getSlotConfig(configData, slotName) {
    const slots = configData?.googleAdSlots || {};
    const names = getSlotNames(slotName);
    return names.map((name) => slots[name]).find(Boolean) || {};
}

function getGoogleAdSlot(configData, slotName) {
    const slotConfig = getSlotConfig(configData, slotName);
    const client = clean(slotConfig.client || configData?.externalIntegrations?.googleAdsenseClient).toLowerCase();
    const slot = clean(slotConfig.slot);

    if (!ADSENSE_CLIENT_PATTERN.test(client) || !ADSENSE_SLOT_PATTERN.test(slot)) return null;

    return {
        client,
        slot,
        format: clean(slotConfig.format) || 'auto',
        fullWidthResponsive: slotConfig.fullWidthResponsive !== false,
        enabledWhenNoAdvertiser: slotConfig.enabledWhenNoAdvertiser === true,
    };
}

function getActiveCampaign(configData, slotName) {
    const now = Date.now();
    const slotNames = new Set(getSlotNames(slotName));
    return (configData?.adCampaigns || []).find((campaign) => {
        if (campaign?.status !== 'نشط') return false;
        if (!slotNames.has(campaign?.adLocation)) return false;
        const start = campaign.startTime ? new Date(campaign.startTime).getTime() : 0;
        const end = campaign.endTime ? new Date(campaign.endTime).getTime() : Number.POSITIVE_INFINITY;
        return now >= start && now <= end && Boolean(clean(campaign.imageUrl));
    });
}

function GoogleAdsenseUnit({ ad, scriptId }) {
    if (!ad) return null;

    return (
        <>
            <Script
                id={`${scriptId}-loader`}
                strategy="afterInteractive"
                async
                crossOrigin="anonymous"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ad.client)}`}
            />
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ad.client}
                data-ad-slot={ad.slot}
                data-ad-format={ad.format}
                data-full-width-responsive={String(ad.fullWidthResponsive)}
            ></ins>
            <Script id={scriptId} strategy="afterInteractive">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
        </>
    );
}

export default function PublicAdSlot({ configData, slotName, label = 'مساحة إعلانية', compact = false }) {
    const [imageFailed, setImageFailed] = useState(false);
    const slotConfig = getSlotConfig(configData, slotName);
    const campaign = getActiveCampaign(configData, slotName);
    const googleAd = getGoogleAdSlot(configData, slotName);
    const imageUrl = clean(campaign?.imageUrl);
    const hasActiveCampaign = Boolean(campaign);
    const targetUrl = clean(campaign?.targetUrl);
    const houseText = clean(slotConfig.houseAdText) || 'أعلن معنا في هذه المساحة';
    const shouldShowHouseAd = slotConfig.showHouseAd === true;
    const adId = campaign?.campaignNumber || campaign?.id || `slot_${slotName}`;

    useEffect(() => {
        setImageFailed(false);
    }, [imageUrl]);

    let content = null;
    if (imageUrl && !imageFailed) {
        content = (
            <Image
                src={imageUrl}
                alt={campaign?.campaignName || label}
                width={728}
                height={180}
                unoptimized
                onError={() => setImageFailed(true)}
            />
        );
    } else if (!hasActiveCampaign && googleAd?.enabledWhenNoAdvertiser) {
        content = <GoogleAdsenseUnit ad={googleAd} scriptId={`adsbygoogle-${slotName}-init`} />;
    } else if (!hasActiveCampaign && shouldShowHouseAd) {
        content = (
            <span className="public-ad-house">
                <i className="fa-solid fa-bullhorn"></i>
                {houseText}
            </span>
        );
    }

    if (!content) return null;

    const body = (
        <div
            className={`public-ad-slot ${compact ? 'compact' : ''}`}
            data-ad-location={slotName}
            data-ad-id={adId}
            onMouseEnter={() => { window.hoveredAdId = adId; }}
            onMouseLeave={() => { window.hoveredAdId = null; }}
        >
            {content}
        </div>
    );

    if (targetUrl && imageUrl) {
        return <Link href={targetUrl} target="_blank" rel="noopener noreferrer" className="public-ad-link">{body}</Link>;
    }

    return body;
}
