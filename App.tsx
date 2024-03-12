import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import {OneSignal} from 'react-native-onesignal';

const App = () => {
  const [refresherEnabled, setEnableRefresher] = useState(true);
  const webViewRef: any = useRef();
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  //Pull To Down Refresh
  const handleScroll = (res: any) => {
    const yOffset = Number(res.nativeEvent.contentOffset.y);
    if (yOffset === 0) {
      setEnableRefresher(true);
    } else {
      setEnableRefresher(false);
    }
  };

  useEffect(() => {
    OneSignal.initialize('22b40bae-7d75-4e0c-b781-8b0399e9b781');
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('OneSignal: notification clicked:', event);
    });
  }, [OneSignal]);

  useEffect(() => {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [handleBack]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={false}
            enabled={refresherEnabled}
            onRefresh={() => {
              webViewRef.current.reload();
            }}
          />
        }>
        <WebView
          source={{uri: 'https://www.myalpins.com/en/content/12-app'}}
          onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
          ref={webViewRef}
          originWhitelist={['*']}
          onScroll={handleScroll}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          startInLoadingState
          cacheEnabled
          allowsFullscreenVideo
          setBuiltInZoomControls
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;