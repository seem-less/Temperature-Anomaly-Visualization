#include "ofApp.h"

using namespace cv;
using namespace ofxCv;

//--------------------------------------------------------------
void ofApp::setup(){

	//Object detection here
	ofSetVerticalSync(true);
	cam.setup(600, 450);
	bw.allocate(600, 450, OF_IMAGE_GRAYSCALE);
	previous.allocate(600, 450, OF_IMAGE_GRAYSCALE); //frame differencing
	diff.allocate(600, 450, OF_IMAGE_GRAYSCALE); //frame differencing
	gui.setup();
	gui.add(resetBackground.set("Reset Background", false));
	//gui.add(learningTime.set("Learning Time", 30, 0, 120));
	gui.add(thresholdValue.set("Threshold Value", 10, 0, 255));
	gui.add(iterations.set("No. Iterations", 1, 0, 10)); //dilation iterations
	gui.add(radius.set("Radius", 50, 0, 100)); //blur radius
	contourzz.getTracker().setPersistence(15);
	contourzz.getTracker().setMaximumDistance(32);
	bLearnBackground = true;
	thresh.allocate(600, 450, OF_IMAGE_GRAYSCALE);
	detectLowX = 32;
	detectHighX = 575;
	minArea = 37;
	maxArea = 183;

	//Visualization here
	ofLogToConsole();
	ofEnableSmoothing();
	orbitron1.load("Orbitron-Regular.ttf", 96);
	orbitron2.load("Orbitron-Regular.ttf", 32);

	//ARDUINO CONNECTIVITY INCOMPLETE
	/*serial.listDevices();
	vector <ofSerialDeviceInfo> deviceList = serial.getDeviceList();
	int baud = 57600;
	serial.setup(0, 57600);*/
}

//--------------------------------------------------------------
void ofApp::update(){
	//to change interaction, change this variable
	//inputInteraction = ofGetMouseX(); // from 0 to width
	inputInteraction = center.x; // from detectLowX and detectHighX

	//Visualization here
	if(inputInteraction <= detectHighX && inputInteraction >= detectLowX){
		spectrum = ofMap(inputInteraction, detectLowX, detectHighX, 0, 137);
		changeLabel = label[spectrum];
		changeValue = value[spectrum];
		float valToFloat = std::stof(changeValue);
	}

	//Object detection here
	cam.update();
	if (resetBackground) {
		background.reset();
		resetBackground = false;
	}
	if (cam.isFrameNew()) {
		//background.setLearningTime(learningTime); //for continuous learning
		//frame differencing here
		convertColor(cam, bw, CV_RGB2GRAY);
		absdiff(bw, previous, diff);
		copy(bw, previous);
		blur(diff, radius);
		threshold(diff, diff, thresholdValue, false);
		diff.update();
		//diffMean = mean(toCv(diff)); //for colour indication
		//diffMean *= Scalar(50);  //for color indication
		blur(thresh, radius);
		convertColor(cam, thresh, CV_RGB2GRAY); //ofxCv function for background subtraction
		background.setThresholdValue(thresholdValue); //ofxCv function with background
		contourzz.setMinAreaRadius(minArea);
		contourzz.setMaxAreaRadius(maxArea);	
		contourzz.setInvert(false); 
		background.update(cam, thresh);//ofxCv function for background subtraction
		thresh.update();//ofxCv function for background subtraction
		dilate(diff, diff, iterations);
		dilate(thresh, thresh, iterations);
		contourzz.findContours(diff); 
		//MIXING BACKGROUND SUBTRACTION AND FRAME DIFFERENCING HERE
		//if (contourzz.size() == 0) {
		//	contourzz.findContours(thresh); 
		//}
	}

	//ARDUINO CONNECTIVITY INCOMPLETE
	////write to arduino
	//mouseinfo = std::to_string(inputInteraction) + "\n";
	//serial.writeBytes(mouseinfo);
	////read from arduino
	//input = serial.readByte();
	//std::string inputToChar = std::to_string(input);
	//char const *ardChar = inputToChar.c_str();
	//inputval.append(ardChar, 4);
	///*if (myByte == OF_SERIAL_NO_DATA)
	//	printf("no data was read \n");
	//else if (myByte == OF_SERIAL_ERROR)
	//	printf("an error occurred \n");
	//else
	//	*/
	//printf("myByte is %d \n", inputval);
}

//--------------------------------------------------------------
void ofApp::draw() {
	//Visualization here
	ofPushMatrix();
	ofBackground(255);
	ofSetLineWidth(4);
	ofTranslate(ofGetWidth() / 2, ofGetHeight() / 2);
	ofSetColor(ofColor::black);
	ofNoFill();
	ofDrawCircle(0, 0, circleMd);

	if (inputInteraction <= detectHighX && inputInteraction >= detectLowX) {
		ofPushStyle();
		ofSetColor(255);
		ofFill();
		ofSetRectMode(OF_RECTMODE_CENTER);
		ofSetColor(0);
		orbitron2.drawString(changeLabel, -60, 475);
		ofPopStyle();

		for (int i = 0; i < spectrum; i++) {
			ofSetColor(0);
			orbitron1.drawString(changeValue, -200, 50);
			mag = ofMap(std::stof(value[i]), -0.44, 0.94, circleId, circleOd);
			spectrumPrev = i - 1;
			if (spectrumPrev < 0) {
				spectrumPrev = 0;
			}
			magPrev = ofMap(std::stof(value[spectrumPrev]), -0.44, 0.94, circleId, circleOd);

			if (mag <= 350) {
				ofPushStyle();
				ofSetColor(0, 0, 255, 100);
				ofFill();
			}
			else {
				ofPushStyle();
				ofSetColor(255, 0, 0, 100);
				ofFill();
			}
			ofVec2f v1(0, -mag);
			v1.rotate(i * 30);

			ofVec2f v2(0, -magPrev);
			v2.rotate(spectrumPrev * 30);
			ofBeginShape();
			ofVertex(0, 0);
			ofVertex(v1.x, v1.y);
			ofVertex(v2.x, v2.y);
			ofEndShape();
			ofPopStyle();
		}
	}
	ofPopMatrix();

	//Object Detection here
	ofSetHexColor(0xffffff);
	RectTracker& tracker = contourzz.getTracker();
	cam.draw(1320, 0);
	//diff.draw(640, 500); //frame differencing
	//previous.draw(1280, 500);
	//thresh.draw(0, 400); 
	ofPushMatrix();
	ofTranslate(1320, 0);
	contourzz.draw();
	for (int i = 0; i < contourzz.size(); i++) {
		center = toOf(contourzz.getCenter(i));
		ofDrawCircle(center.x, center.y, 15);
	}
	ofPopMatrix();
	gui.draw();
}

void ofApp::mousePressed(int x, int y, int button){
	autothreshold(thresh); //for background subtraction
	autothreshold(diff);
}
