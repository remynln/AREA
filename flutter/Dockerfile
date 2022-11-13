FROM androidsdk/android-30

# Install flutter
RUN apt-get update
RUN apt-get install -y bash git unzip wget
RUN apt-get clean
WORKDIR /
RUN git clone https://github.com/flutter/flutter.git
ENV PATH "$PATH:/flutter/bin"
ENV FLUTTER_PATH /flutter/
RUN flutter upgrade
RUN flutter precache

# Install gradle
RUN wget https://services.gradle.org/distributions/gradle-7.3.3-bin.zip
RUN mkdir /opt/gradle
RUN unzip -d /opt/gradle gradle-7.3.3-bin.zip
ENV PATH "$PATH:/opt/gradle/gradle-7.3.3/bin"
RUN rm gradle-7.3.3-bin.zip

RUN mkdir -p /app/android
RUN echo "sdk.dir=$ANDROID_SDK" >> /app/android/local.properties
RUN echo "flutter.sdk=$FLUTTER_PATH" >> /app/android/local.properties
RUN echo "flutter.buildMode=release" >> /app/android/local.properties
RUN echo "flutter.versionName=1.0.0" >> /app/android/local.properties
RUN echo "flutter.versionCode=1" >> /app/android/local.properties

WORKDIR /app/android
COPY ./ /app/

RUN gradle --refresh-dependencies
RUN flutter build apk --release

CMD mv ../app/build/app/outputs/flutter-apk/app-release.apk /app/client/area_mobile.apk