#import "Ttlock.h"
#import <TTLock/TTLock.h>
#import <MJExtension/MJExtension.h>


#define NOT_NULL_STRING(string) (string ?: @"")
#define CHECK_BLOCK_NULL_RETURN(block) if(block == nil)return;

#define EVENT_SCAN_LOCK @"EventScanLock"

@implementation Ttlock

RCT_EXPORT_MODULE()

+ (void)initialize
{
    [TTLock setupBluetooth:^(TTBluetoothState state) {
        NSLog(@"蓝牙状态:%@",@(state));
    }];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_SCAN_LOCK];
}


RCT_EXPORT_METHOD(startScan)
{
    [TTLock startScan:^(TTScanModel *scanModel) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"lockName"] = scanModel.lockName;
        data[@"lockMac"] = scanModel.lockMac;
        data[@"isInited"] = @(scanModel.isInited);
        data[@"isKeyboardActivated"] = @(scanModel.isAllowUnlock);
        data[@"electricQuantity"] = @(scanModel.electricQuantity);
        data[@"lockVersion"] = scanModel.lockVersion;
        data[@"lockSwitchState"] = @(scanModel.lockSwitchState);
        data[@"RSSI"] = @(scanModel.RSSI);
        data[@"oneMeterRSSI"] = @(scanModel.oneMeterRSSI);

        [self sendEventWithName:EVENT_SCAN_LOCK body:data];
    }];
}



RCT_EXPORT_METHOD(initLock:(NSDictionary *)dict success:(RCTResponseSenderBlock)successfulBlock fail:(RCTResponseSenderBlock)failedBlock)
{
    [TTLock initLockWithDict:dict success:^(NSString *lockData) {
        CHECK_BLOCK_NULL_RETURN(successfulBlock)
        successfulBlock(@[lockData]);
    } failure:^(TTError errorCode, NSString *errorMsg) {
        CHECK_BLOCK_NULL_RETURN(failedBlock)
        failedBlock(@[@(errorCode),NOT_NULL_STRING(errorMsg)]);
    }];
}

RCT_EXPORT_METHOD(resetLock:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock resetLockWithLockData:lockData success:^() {
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(resetEkey:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetEkeyWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(controlLock:(NSInteger)controlAction lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock controlLockWithControlAction:controlAction lockData:lockData success:^(long long lockTime, NSInteger electricQuantity, long long uniqueId) {
        
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}





+ (void)response:(NSObject *)data success:(RCTResponseSenderBlock)success{
    CHECK_BLOCK_NULL_RETURN(success);
    NSArray *responseData = data ? @[data] : nil;
    success(responseData);
}

+ (void)response:(NSInteger)code message:(NSString *)message fail:(RCTResponseSenderBlock)fail{
    CHECK_BLOCK_NULL_RETURN(fail);
    fail(@[@(code),NOT_NULL_STRING(message)]);
}

@end
