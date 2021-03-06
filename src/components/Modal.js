import React, { Component } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as appActions from '../utils/store/appAction';
import Selector from './Selector';
import LoadingMask from './LoadingMask';
import CloseableModal from './CloseableModal';

@connect(({ app }) => {
	return {
		activeModal: app.activeModal,
		selectorConfigs: app.selectorConfigs,
	};
})

export default class Modal extends Component {
	static propTypes = {
		activeModal: React.PropTypes.any,
		dispatch: React.PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
			activeModal: this.props.activeModal,
		};
	}

	componentDidMount() {
		this.playTransition(this.props.activeModal);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeModal !== this.props.activeModal) {
			this.playTransition(nextProps.activeModal);
		}
	}

	playTransition(activeModal) {
		const nextValue = activeModal ? 1 : 0;

		if (!activeModal) {
			this.playAnimation(nextValue, () => {
				this.setState({ activeModal: null });
			});
		} else {
			this.setState({ activeModal });
			this.playAnimation(nextValue);
		}
	}

	render() {
		const backgroundColor = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)'],
			}),
			containerStyles = {
				backgroundColor,
			};

		return this.state.activeModal ? <Animated.View
			style={[styles.container, containerStyles]}>
			<View
				style={styles.innerTouchable}
				onPress={this.onBackdropPress}>
				{this.renderModalInner()}
			</View>
		</Animated.View> : <View/>;
	}

	renderModalInner() {
		switch (this.state.activeModal) {
		case 'select':
			return <Selector animation={this.state.enterAnimation}/>;
		case 'modal':
			return <CloseableModal animation={this.state.enterAnimation}/>;
		case 'loading':
			return <LoadingMask animation={this.state.enterAnimation}/>;
		default:
			return <View/>;
		}
	}

	onBackdropPress = () => {
		this.props.dispatch(appActions.toggleSelect(false));
	};

	playAnimation = (toValue: Number, callback) => {
		if (this.animation) this.animation.clear();

		const animations = [
			Animated.timing(this.state.enterAnimation, {
				toValue,
				duration: 500,
				easing: Easing.in(Easing.bezier(0, 0.48, 0.35, 1)),
			}),
		];

		this.animation = Animated.parallel(animations).start(callback);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
	},
	innerTouchable: {
		flex: 1,
	},
});