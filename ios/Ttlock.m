#import "Ttlock.h"
#import <TTLock/TTLock.h>
#import <MJExtension/MJExtension.h>


#define NOT_NULL_STRING(string) (string ?: @"")
#define CHECK_BLOCK_NULL_RETURN(block) if(block == nil)return;

#define EVENT_SCAN_LOCK @"EventScanLock"
#define EVENT_ADD_CARD_PROGRESS @"EventAddCardProgrress"
#define EVENT_ADD_FINGERPRINT_PROGRESS @"EventAddFingerprintProgrress"
#define EVENT_BLUETOOTH_STATE @"EventBluetoothState"

@implementation Ttlock

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init{
    if (self = [super init]) {
        __weak Ttlock *weakSelf = self;
        [TTLock setupBluetooth:^(TTBluetoothState state) {
            [weakSelf sendEventWithName:EVENT_BLUETOOTH_STATE body:@(state)];
        }];
    }
    return self;
}


- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_SCAN_LOCK,EVENT_ADD_CARD_PROGRESS,EVENT_ADD_FINGERPRINT_PROGRESS,EVENT_BLUETOOTH_STATE];
}



RCT_EXPORT_METHOD(startScan)
{
    
    [TTLock startScan:^(TTScanModel *scanModel) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"lockName"] = scanModel.lockName;
        data[@"lockMac"] = scanModel.lockMac;
        data[@"isInited"] = @(scanModel.isInited ? true : false);
        data[@"isKeyboardActivated"] = @(scanModel.isAllowUnlock ? true : false);
        data[@"electricQuantity"] = @(scanModel.electricQuantity);
        data[@"lockVersion"] = scanModel.lockVersion;
        data[@"lockSwitchState"] = @(scanModel.lockSwitchState);
        data[@"RSSI"] = @(scanModel.RSSI);
        data[@"oneMeterRSSI"] = @(scanModel.oneMeterRSSI);

        [self sendEventWithName:EVENT_SCAN_LOCK body:data];
    }];
}

RCT_EXPORT_METHOD(stopScan)
{
    [TTLock stopScan];
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


RCT_EXPORT_METHOD(controlLock:(NSInteger)controlAction lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    TTControlAction action = controlAction + 1;
    [TTLock controlLockWithControlAction:action lockData:lockData success:^(long long lockTime, NSInteger electricQuantity, long long uniqueId) {
        NSDictionary *dict = @{
            @"lockTime": @(lockTime),
            @"electricQuantity": @(electricQuantity),
            @"uniqueId":@(uniqueId)
        };
        [Ttlock response:dict success:success];
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

RCT_EXPORT_METHOD(setLockTime:(nonnull NSNumber *)timestamp lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setLockTimeWithTimestamp:timestamp.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock getLockTimeWithLockData:lockData success:^(long long lockTimestamp) {
        [Ttlock response:@(lockTimestamp) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockOperateRecord:(int)type lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTOperateLogType logType = type + 1;
    [TTLock getOperationLogWithType:logType lockData:lockData success:^(NSString *operateRecord) {
        [Ttlock response:operateRecord success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(createCustomPasscode:(NSString *)passcode startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock createCustomPasscode:passcode startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyPasscode:(NSString *)passcodeOrigin passcodeNew:(NSString *)passcodeNew startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyPasscode:passcodeOrigin newPasscode:passcodeNew startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deletePasscode:(NSString *)passcode lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock deletePasscode:passcode lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(resetPasscode:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetPasscodesWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSwitchStateWithLockData:lockData success:^(TTLockSwitchState state) {
        [Ttlock response:@(state) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


//RCT_EXPORT_METHOD(addCard:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData  success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
//{
//
////    __weak Ttlock *weakSelf = self;
//    [TTLock addICCardStartDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {
//        [weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
//    } success:^(NSString *cardNumber) {
//        [Ttlock response:cardNumber success:success];
//    } failure:^(TTError errorCode, NSString *errorMsg) {
//        [Ttlock response:errorCode message:errorMsg fail:fail];
//    }];
//}

RCT_EXPORT_METHOD(addCard:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{

    __weak Ttlock *weakSelf = self;
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock addICCardStartDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {
            [weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
        } success:^(NSString *cardNumber) {
            [Ttlock response:cardNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock addICCardWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {[weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
        } success:^(NSString *cardNumber) {
            [Ttlock response:cardNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}

RCT_EXPORT_METHOD(modifyCardValidityPeriod:(NSString *)cardNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock modifyICCardValidityPeriodWithCardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock modifyICCardValidityPeriodWithCardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}


RCT_EXPORT_METHOD(deleteCard:(NSString *)cardNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteICCardNumber:cardNumber lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllCards:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllICCardsWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addFingerprint:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    __weak Ttlock *weakSelf = self;
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock addFingerprintStartDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
            NSDictionary *dict = @{
                @"currentCount": @(currentCount),
                @"totalCount": @(totalCount)
            };
            [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:dict];
        } success:^(NSString *fingerprintNumber) {
            [Ttlock response:fingerprintNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock addFingerprintWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
            NSDictionary *dict = @{
                @"currentCount": @(currentCount),
                @"totalCount": @(totalCount)
            };
            [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:dict];
        } success:^(NSString *fingerprintNumber) {
            [Ttlock response:fingerprintNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}

RCT_EXPORT_METHOD(modifyFingerprintValidityPeriod:(NSString *)fingerprintNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock modifyFingerprintValidityPeriodWithFingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock modifyFingerprintValidityPeriodWithCyclicConfig:cycleList fingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}


RCT_EXPORT_METHOD(deleteFingerprint:(NSString *)fingerprintNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteFingerprintNumber:fingerprintNumber lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllFingerprints:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllFingerprintsWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyAdminPasscode:(NSString *)adminPasscode  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock modifyAdminPasscode:adminPasscode lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}




RCT_EXPORT_METHOD(getLockAutomaticLockingPeriodicTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getAutomaticLockingPeriodicTimeWithLockData:lockData success:^(int currentTime, int minTime, int maxTime) {
        NSDictionary *dict = @{
            @"currentTime": @(currentTime),
            @"maxTime": @(maxTime),
            @"minTime": @(minTime)
        };
        [Ttlock response:dict success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(setLockAutomaticLockingPeriodicTime:(int)time  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setAutomaticLockingPeriodicTime:time lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockRemoteUnlockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getRemoteUnlockSwitchWithLockData:lockData success:^(BOOL isOn) {
        [Ttlock response:@(isOn) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockRemoteUnlockSwitchState:(BOOL)isOn  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setRemoteUnlockSwitchOn:isOn lockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockConfig:(int)config  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    TTLockConfigType type = config + 1;
    [TTLock getLockConfigWithType:type lockData:lockData success:^(TTLockConfigType type, BOOL isOn) {
        NSDictionary *dict = @{
            @"type": @(type),
            @"isOn": @(isOn)
        };
        [Ttlock response:dict success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockConfig:(int)config isOn:(BOOL)isOn lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTLockConfigType type = config + 1;
    [TTLock setLockConfigWithType:type on:isOn lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addPassageMode:(int)type
                  weekly:(NSArray<NSNumber *> *)weekly
                 monthly:(NSArray<NSNumber *> *)monthly
               startDate:(int)startDate
                 endDate:(int)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTPassageModeType modeType = type + 1;
    [TTLock configPassageModeWithType:modeType weekly:weekly monthly:monthly startDate:startDate endDate:endDate lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(clearAllPassageModes:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearPassageModeWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(supportFunction:(NSString *)featureValue fuction:(int)fuction callback:(RCTResponseSenderBlock)callback)
{
    int supportFunction = fuction;
    if (supportFunction > 28) {
        supportFunction += 4;
    }else if (supportFunction > 26) {
        supportFunction += 3;
    }else if (supportFunction > 16) {
        supportFunction += 2;
    }else if (supportFunction > 5) {
        supportFunction += 1;
    }
    BOOL isSupport = [TTUtil lockFeatureValue:featureValue suportFunction:supportFunction];
    [Ttlock response:@(isSupport) success:callback];
}


#pragma mark - private method


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
