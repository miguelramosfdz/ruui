import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ResponsibleTouchArea from './ResponsibleTouchArea';
import { colors, isAndroid } from '../utils';

export default class SelectorItem extends Component {
	static propTypes = {
		onPress: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		onChange: React.PropTypes.func,
		getTitle: React.PropTypes.func,
		activeInstance: React.PropTypes.any,
		optionInstance: React.PropTypes.any,
	};

	render() {
		const optionInstance = this.props.optionInstance,
			activeInstance = this.props.activeInstance,
			wrapperStyles = {},
			iconStyles = {};
		let iconName = 'radio-button-unchecked';

		if (JSON.stringify(activeInstance) === JSON.stringify(optionInstance)) {
			wrapperStyles.backgroundColor = '#fcfcfc';
			iconStyles.color = colors.iOsBlue;
			iconName = 'radio-button-checked';
		}

		return <ResponsibleTouchArea
			rippleColor={colors.iOsBlue}
			onPress={this.onItemPick}
			wrapperStyle={[styles.optionItemWrapper, wrapperStyles]}
			innerStyle={styles.optionItemInner}
			fadeLevel={0.04}>
			<View style={styles.optionInnerWrapper}>
				<View style={styles.optionIconWrapper}>
					<Icon
						style={[styles.optionIcon, iconStyles]}
						name={iconName}/>
				</View>
				<View style={styles.optionTextWrapper}>
					{this.renderOptionText()}
				</View>
			</View>
		</ResponsibleTouchArea>;
	}

	renderOptionText() {
		const option = this.props.optionInstance,
			optionTitle = this.props.getTitle ? this.props.getTitle(option) : option.title;

		return <Text style={styles.optionTitle}>
			{optionTitle}
		</Text>;
	}

	onItemPick = () => {
		this.props.onPress(this.props.optionInstance);
	}
}

const borderWidth = isAndroid ? 0 : 1,
	selectorPadding = isAndroid ? 20 : 8,
	selectionAlign = isAndroid ? 'left' : 'center';

const styles = StyleSheet.create({
	optionItemWrapper: {
		backgroundColor: '#f9f9f9',
		borderBottomWidth: borderWidth,
		borderColor: '#dedede',
	},
	optionInnerWrapper: {
		flexDirection: 'row',
	},
	optionIconWrapper: {
		width: 20, marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	optionIcon: {
		color: '#dedede',
		fontSize: 18,
	},
	optionItemInner: {
		padding: selectorPadding,
		paddingTop: 12, paddingBottom: 12,
	},
	optionTextWrapper: {
		flex: 1, marginRight: 25,
	},
	optionTitle: {
		color: colors.iOsBlue,
		fontSize: 17,
		textAlign: selectionAlign,
		backgroundColor: 'transparent',
	},
});