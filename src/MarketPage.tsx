import React from "react";
import { Card, CardBody, CardMedia, CardContent, CardHeadline1, CardHeadline3, CardFootnote1 } from '@sberdevices/ui/components/Card';
import { Container, Row } from '@sberdevices/ui/components/Grid/Grid';
import { CarouselWrapper } from '@sberdevices/ui/components/Carousel/CarouselWrapper';
import { Carousel } from '@sberdevices/ui/components/Carousel/Carousel';
import { CarouselGridCol } from '@sberdevices/ui/components/Carousel/CarouselGridCol';

import { ImagePlaceholder } from './ImagePlaceholder';
import { useRemote,RemoteKey } from './useRemote';

export const MarketPage = () => {
    const items = Array(Number(10)).fill(0);

    const [index, setIndex] = React.useState(0);
    const handlePrev = () => setIndex(Math.max(index - 1, 0));
    const handleNext = () => setIndex(Math.min(index + 1, items.length - 1));

    useRemote((key: RemoteKey) => {
      switch(key) {
        case 'LEFT':
          handlePrev();
          break;
        case 'RIGHT':
          handleNext();
          break;
        default:
            break;
      }
    });

    return (
        <Container>
            <CarouselWrapper inContainer>
                <Row>
                    <Carousel axis="x" index={index} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                        {items.map((_, i) => (
                            <CarouselGridCol key={`item:${i}`} size={3}>
                                <Card highlightOnFocus focused={i === index}>
                                    <CardBody>
                                        <CardMedia src="" height="12rem">
                                            <ImagePlaceholder color="white" width="100%" height="12rem" rotation={29} />
                                        </CardMedia>
                                        <CardContent>
                                            <CardHeadline3>Bestseller</CardHeadline3>
                                            <CardHeadline1 style={{ marginTop: '0.75rem' }}>Game {i}</CardHeadline1>
                                            <CardFootnote1 style={{ marginTop: '0.375rem' }} view="secondary">
                                                Popular Game Studios
                                            </CardFootnote1>
                                        </CardContent>
                                    </CardBody>
                                </Card>
                            </CarouselGridCol>
                        ))}
                    </Carousel>
                </Row>
            </CarouselWrapper>
        </Container>
    );
};
