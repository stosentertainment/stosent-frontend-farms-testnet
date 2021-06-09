import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import CardContent from './CardContent'
import InfoRow from './InfoRow'

const NftInWalletCard = ({ balanceOf }) => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <CardContent imgSrc="/images/present.svg">
          <Heading mb="8px">{TranslateString(999, 'NFT in wallet')}</Heading>
          <InfoRow>
            <Text>{TranslateString(999, 'BalanceOf: ')}</Text>
            <Text>
              <strong>{balanceOf}</strong>
            </Text>
          </InfoRow>
        </CardContent>
      </CardBody>
    </Card>
  )
}

export default NftInWalletCard
