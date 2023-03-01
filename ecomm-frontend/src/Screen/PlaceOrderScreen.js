import React, { useEffect } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Alert';
import { createOrder } from '../actions/oderActions';

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart);

    if(!cart.shippingAddress.address){
        navigate('/shipping')
    }else if(!cart.paymentmethod){
        navigate('/payment')
    }

    // Calculating Price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    cart.itemPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0))
    cart.shippingPrice = addDecimals(cart.itemPrice > 100 ? 0 : 60);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemPrice).toFixed(2)))
    cart.totalPrice = Number(cart.itemPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)


    // console.log(cart)

    const orderCreate = useSelector(state => state.orderCreate);
    console.log('createOrder',createOrder)  //Geeting error from here I've to start solving from this code
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if(success){
            navigate(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    }, [success, navigate])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentmethod: cart.paymentmethod,
            itemPrice: cart.itemPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    return (
        <div className=' my-3'>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method: </h2>
                            <strong>Method: </strong>
                            {cart.paymentmethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message>Cart is empty</Message>
                            ) : (
                                <ListGroup>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col>
                                                    Price : {item.qty} x {item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>

                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Ordered Items</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${cart.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='dander'>{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default PlaceOrderScreen